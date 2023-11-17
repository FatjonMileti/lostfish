import { styled } from '@mui/system';
import { Modal, ModalProps } from '../../../../components/Modal';

interface MakeAnOfferModalProps extends ModalProps {}

export const MakeAnOfferModal = styled(({ ...rest }: MakeAnOfferModalProps) => {
  return <Modal {...rest}>Test</Modal>;
})``;
