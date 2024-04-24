import { ValueObject } from '@/core/entities/value-object';

export interface RecipientEmailProps {
  email: string;
}
export class RecipientEmail extends ValueObject<RecipientEmailProps> {
  get email() {
    return this.props.email;
  }

  static create(props: RecipientEmailProps) {
    return new RecipientEmail(props);
  }
}
