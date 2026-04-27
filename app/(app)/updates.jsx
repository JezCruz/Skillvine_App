import { useEffect, useState } from 'react';
import { Text, Linking, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

import Screen from '../../components/Screen';
import Card from '../../components/Card';
import AppButton from '../../components/AppButton';
import { fetchAppVersion } from '../../services/api';

export default function Updates() {
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetchAppVersion();
    setData(res);
  };

  const downloadUpdate = async () => {
    if (!data?.apk_url || downloading) return;

    Alert.alert(
      'Install Update?',
      `Do you want to download and install Skillvine version ${data.latest_version}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Update',
          onPress: async () => {
            try {
              setDownloading(true);
              setProgress(0);

              const fileUri = FileSystem.documentDirectory + 'skillvine-update.apk';

              const downloadResumable = FileSystem.createDownloadResumable(
                data.apk_url,
                fileUri,
                {},
                (downloadProgress) => {
                  const percent =
                    downloadProgress.totalBytesWritten /
                    downloadProgress.totalBytesExpectedToWrite;

                  setProgress(Math.round(percent * 100));
                }
              );

              const result = await downloadResumable.downloadAsync();

              setDownloading(false);
              setProgress(100);

              if (result?.uri) {
                Alert.alert(
                  'Download Complete',
                  'The update has finished downloading. Open installer now?',
                  [
                    {
                      text: 'Later',
                      style: 'cancel',
                    },
                    {
                      text: 'Install Now',
                      onPress: () => Linking.openURL(result.uri),
                    },
                  ]
                );
              }
            } catch (err) {
              console.log('Download failed:', err);
              setDownloading(false);

              Alert.alert(
                'Download Failed',
                'Could not download the update. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  if (!data) {
    return (
      <Screen>
        <Text style={{ color: 'white' }}>Loading...</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ color: 'white', fontSize: 26, marginBottom: 12 }}>
        Latest Updates
      </Text>

      <Card>
        <Text style={{ color: '#22c55e', fontSize: 18 }}>
          Version: {data.latest_version}
        </Text>

        <Text style={{ color: data.force_update ? '#ef4444' : '#22c55e', marginTop: 8 }}>
          {data.force_update ? 'Update required' : 'Optional update'}
        </Text>

        {data.notes?.map((note, index) => (
          <Text key={index} style={{ color: '#94a3b8', marginTop: 4 }}>
            • {note}
          </Text>
        ))}

        {downloading && (
          <Text style={{ color: '#38bdf8', marginTop: 12 }}>
            Downloading... {progress}%
          </Text>
        )}

        <AppButton
          title={downloading ? `Downloading ${progress}%` : 'Download Update'}
          onPress={downloadUpdate}
          style={{ marginTop: 12 }}
        />
      </Card>
    </Screen>
  );
}