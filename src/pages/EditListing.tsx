import { useParams } from 'react-router-dom';
import Publish from './Publish';

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  return <Publish editingId={id} />;
};

export default EditListing;
