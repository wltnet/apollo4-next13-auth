import ErrorSection from './ErrorSection';
import { Errors } from '@/types/form';

export interface Props {
  errors: Errors[];
  apiErrors: string;
}

export default ErrorSection;
