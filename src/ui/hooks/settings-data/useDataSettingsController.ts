import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  BackupSummary,
  dateReviver,
  exportBackup,
  replaceAllFromBackup,
  summarize,
  validateBackup,
} from '@/domain/backup';
import { ConfirmRequest } from '@/ui/components/ConfirmDialog';
import { useSnackbar } from '@/ui/components/Snackbar';

type Pending = { summary: BackupSummary; payload: ReturnType<typeof validateBackup> };

export function useDataSettingsController() {
  const qc = useQueryClient();
  const snackbar = useSnackbar();
  const [busy, setBusy] = useState<'idle' | 'exporting' | 'importing'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

  async function exportData() {
    if (busy !== 'idle') return;
    setErrorMsg(null);
    setBusy('exporting');
    try {
      const payload = await exportBackup();
      const json = JSON.stringify(payload, null, 2);
      const stamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .slice(0, 19);
      const uri = `${FileSystem.cacheDirectory}tripcart-backup-${stamp}.json`;
      await FileSystem.writeAsStringAsync(uri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/json',
          dialogTitle: 'Share TripCart backup',
          UTI: 'public.json',
        });
        snackbar.show({ kind: 'success', message: 'Backup exported.' });
      } else {
        setErrorMsg(`Saved backup at ${uri} (sharing unavailable on this device).`);
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Export failed.');
      snackbar.show({ kind: 'error', message: 'Export failed.' });
    } finally {
      setBusy('idle');
    }
  }

  async function pickImport() {
    if (busy !== 'idle') return;
    setErrorMsg(null);
    const res = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/json', '*/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (res.canceled) return;
    const asset = res.assets[0];
    if (!asset) return;
    try {
      const text = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const parsed = JSON.parse(text, dateReviver);
      const payload = validateBackup(parsed);
      const summary = summarize(payload);
      setPending({ summary, payload });
      const exported = summary.exported_at
        ? new Date(summary.exported_at).toLocaleString()
        : 'unknown date';
      setConfirm({
        title: 'Replace all data?',
        message: `Backup from ${exported} · ${summary.stores} stores, ${summary.categories} categories, ${summary.goods} goods, ${summary.trips} trips, ${summary.trip_items} items.\n\nThis will erase ALL current data and replace it with the backup. Cannot be undone.`,
        confirmLabel: 'Replace',
        destructive: true,
        onConfirm: async () => {
          await applyImport(payload);
        },
      });
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Could not read backup.');
    }
  }

  async function applyImport(payload: ReturnType<typeof validateBackup>) {
    setBusy('importing');
    try {
      await replaceAllFromBackup(payload);
      await qc.invalidateQueries();
      setPending(null);
      snackbar.show({ kind: 'success', message: 'Backup restored.' });
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Import failed.');
      snackbar.show({ kind: 'error', message: 'Import failed.' });
    } finally {
      setBusy('idle');
    }
  }

  return {
    busy,
    errorMsg,
    confirm,
    setConfirm,
    pending,
    exportData,
    pickImport,
  } as const;
}
