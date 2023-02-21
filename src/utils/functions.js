import ReactGA from "react-ga4";

export const AnalyticEvent = (
  name = "default",
  action,
  category,
  id = "default"
) => {
  if (name !== "default") {
    ReactGA.event(name, {
      action: action,
      category: category,
    });
  }

  if (id !== "default") {
    ReactGA.event({
      action: action,
      category: category,
      label: id,
    });
  }

  ReactGA.event({
    action: action,
    category: category,
  });
};
