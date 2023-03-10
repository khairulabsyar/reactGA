import React from "react";
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import ErrorPage from "./error-page";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index from "./routes";

const router = createHashRouter(
  createRoutesFromElements(
    <Route
      path='/'
      element={<Root />}
      loader={rootLoader}
      action={rootAction}
      errorElement={<ErrorPage />}
    >
      <Route index element={<Index />} />
      <Route
        path='contacts/:contactId'
        element={<Contact />}
        loader={contactLoader}
        action={contactAction}
      />
      <Route
        path='contacts/:contactId/edit'
        element={<EditContact />}
        loader={contactLoader}
        action={editAction}
      />
      <Route path='contacts/:contactId/destroy' action={destroyAction} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
