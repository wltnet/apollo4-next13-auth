import { Section, ErrorLink } from './styled';
import { Props } from '.';

const ErrorSection = ({ errors, apiErrors }: Props) => (
  <Section id="errors" aria-live="assertive" tabIndex={-1}>
    {
      errors.length > 0 &&
      (
        <ol>
        {
          errors.map((error) => <li key={error.message}><ErrorLink href={`#${error.name}`}>{ error.message }</ErrorLink></li> )
        }
        </ol>
      )
    }
    {
      apiErrors && <div>{ apiErrors }</div>
    }
    </Section>
);

export default ErrorSection;
