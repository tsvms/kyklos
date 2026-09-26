// App entry: Expo Router, plus the headless handler Android calls for widgets.
import 'expo-router/entry';
import { registerWidgets } from './widget';

registerWidgets();
