import { useNavigate, useRouteError } from "react-router-dom";
import { AnalyticEvent } from "./utils/functions";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div id='error-page'>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <button
        type='button'
        onClick={() => {
          AnalyticEvent("Error Page", "URL Error");
          navigate(-1);
        }}
      >
        Go Back
      </button>
    </div>
  );
}
