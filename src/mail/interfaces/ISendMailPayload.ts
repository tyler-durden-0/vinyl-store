import { VinylEntity } from '../../vinyl/vinyl.entity';

export interface ISendMailPayload {
  email: string;
  firstName: string;
  vinyl: VinylEntity;
}
