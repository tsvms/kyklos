import { Alert, Platform, type AlertButton } from 'react-native';
import { upper } from './text';

/**
 * Alert.alert, but Android's all-caps dialog buttons are uppercased the Greek
 * way first (ΔΙΑΓΡΑΦΗ, not ΔΙΑΓΡΑΦΉ).
 */
export function alert(title: string, message?: string, buttons?: AlertButton[]) {
  const fixed =
    Platform.OS === 'android' ? buttons?.map((b) => ({ ...b, text: b.text === undefined ? undefined : upper(b.text) })) : buttons;
  Alert.alert(title, message, fixed);
}
