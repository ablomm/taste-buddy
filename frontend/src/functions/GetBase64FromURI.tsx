import * as FileSystem from 'expo-file-system';

const getBase64 = async (uri: string): Promise<string | null> => {
    try {
      const fileUri = `${FileSystem.cacheDirectory}expo-image-${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: uri, to: fileUri });
      const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
      return base64;
    } catch (error) {
      console.error(error);
      return null;
    }
};
export default getBase64;