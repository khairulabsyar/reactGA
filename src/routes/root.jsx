import { useEffect } from "react";
import {
  Outlet,
  useLoaderData,
  Form,
  NavLink,
  useNavigation,
  useSubmit,
  Link,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import ReactGA from "react-ga4";

export async function loader({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const contacts = await getContacts(search);
  return { contacts, search };
}

export async function action() {
  const contact = await createContact();
  return { contact };
}

export default function Root() {
  const { contacts, search } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("search");

  useEffect(() => {
    document.getElementById("search").value = search;
  }, [search]);

  const clickedNewButton = () => {
    ReactGA.event("select_item", {
      action: "Create New",
      category: "New",
    });
  };

  const selectEvent = (id) => {
    ReactGA.event({
      action: "Select User",
      category: "Select",
      id: id,
    });
  };
  return (
    <>
      <div id='sidebar'>
        <div>
          <Form id='search-Form' role='search'>
            <input
              id='search'
              className={searching ? "loading" : ""}
              aria-label='Search contacts'
              placeholder='Search'
              type='search'
              name='search'
              defaultValue={search}
              onChange={(e) => {
                const isFirstSearch = search == null;
                submit(e.currentTarget.form, { replace: !isFirstSearch });
              }}
            />
            <div id='search-spinner' aria-hidden hidden={!searching} />
            <div className='sr-only' aria-live='polite'></div>
          </Form>
          <Form method='post'>
            <button type='submit' onClick={clickedNewButton}>
              New
            </button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    onClick={selectEvent(contact.id)}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <h1>Google Analytics 4</h1>
        </Link>
      </div>
      <div
        id='detail'
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
