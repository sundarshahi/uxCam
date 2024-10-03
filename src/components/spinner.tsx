import SpinnerIcon from "@/assets/spinner-icon";

type Props = {
  show: boolean;
  message: string;
  image?: string;
};

const Spinner = ({ show, message, image }: Props) => {
  return (
    show && (
      <div role="status" className="text-center pb-[10px]">
        <div
          className="inline-block align-middle w-6 h-6 bg-contain animate-spin"
          data-testid="spinner"
        >
          {image ? <img src={image} alt="Loading icon" /> : <SpinnerIcon />}
        </div>
        <div
          className="border-0  h-px w-px p-0 absolute whitespace-nowrap overflow-hidden	 "
          data-testid="spinner-text"
        >
          {message}
        </div>
      </div>
    )
  );
};

export default Spinner;
