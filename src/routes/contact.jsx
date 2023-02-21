import { Form, useLoaderData, useFetcher, useLocation } from "react-router-dom";
import { getContact, updateContact } from "../contacts";
import ReactGA from "react-ga4";
import { AnalyticEvent } from "../utils/functions";

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    AnalyticEvent("Error on User", "User doesn't exist");
    throw new Response("", {
      status: 404,
      statusText: "User does not exist",
    });
  }
  return { contact };
}

export async function action({ request, params }) {
  let formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact() {
  const { contact } = useLoaderData();
  const location = useLocation();

  ReactGA.send({ hitType: "pageview", page: location.pathname });

  return (
    <div id='contact'>
      <div>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img key={contact.avatar} src={contact.avatar || null} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target='_blank'
              href={`https://twitter.com/${contact.twitter}`}
              rel='noreferrer'
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action='edit'>
            <button
              type='submit'
              onClick={AnalyticEvent("Clicked Edit", "Edit")}
            >
              Edit
            </button>
          </Form>
          <Form method='post' action='destroy'>
            <button
              type='submit'
              onClick={AnalyticEvent("Clicked Delete", "Delete")}
            >
              Delete
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher();
  let favorite = contact.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  return (
    <fetcher.Form method='post'>
      <button
        name='favorite'
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
