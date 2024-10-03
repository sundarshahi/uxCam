type Props = {
  show: boolean | null;
  message: string | null;
};

const Alert = ({ show, message }: Props) => {
  return (
    show && (
      <p role="alert" data-testid="alert" className="m-0">
        {message}
      </p>
    )
  );
};

export default Alert;
