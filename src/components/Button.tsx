import { ButtonContainer, ButtonVariant } from "./Button.styles";

interface Props {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary" }: Props) {
  return <ButtonContainer variant={variant}>Enviar</ButtonContainer>;
}
