import { CheckboxModule } from './CheckboxModule';
import { RadioModule } from './RadioModule';
import { DropdownModule } from './DropdownModule';
import { FormModule } from './FormModule';
import { WebTableModule } from './WebTableModule';
import { IFrameModule } from './IFrameModule';
import { ShadowDomModule } from './ShadowDomModule';
import { DragDropModule } from './DragDropModule';
import { NotificationsModule } from './NotificationsModule';
import { AlertsModule } from './AlertsModule';
import { MouseModule } from './MouseModule';
import { KeyboardModule } from './KeyboardModule';
import { FileUploadModule } from './FileUploadModule';
import { DatePickerModule } from './DatePickerModule';
import { WaitsModule } from './WaitsModule';

export const MODULE_REGISTRY: Record<string, () => React.JSX.Element> = {
  checkbox: CheckboxModule,
  radio: RadioModule,
  dropdown: DropdownModule,
  form: FormModule,
  webtable: WebTableModule,
  iframe: IFrameModule,
  'shadow-dom': ShadowDomModule,
  'drag-drop': DragDropModule,
  notifications: NotificationsModule,
  alerts: AlertsModule,
  mouse: MouseModule,
  keyboard: KeyboardModule,
  'file-upload': FileUploadModule,
  'date-picker': DatePickerModule,
  waits: WaitsModule,
};
