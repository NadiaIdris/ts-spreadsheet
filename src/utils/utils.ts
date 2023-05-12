const SPREADSHEET_HEADING = "spreadsheetHeading";

const setInitialHeading = (defaultHeading: string) => {
  const heading = localStorage.getItem(SPREADSHEET_HEADING);
  if (heading) {
    return heading;
  }
  return defaultHeading;
};

export { setInitialHeading, SPREADSHEET_HEADING };
