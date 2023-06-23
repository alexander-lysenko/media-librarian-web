export enum AppRoutes {
  appHome = "/app",
  login = "/login",
  signup = "/signup",
  profile = "/profile",
}

export enum DataType {
  text = "text",
  varchar255 = "varchar(255)",
  date = "date",
  datetime = "datetime",
}

export enum LibraryElementEnum {
  line = "line",
  text = "text",
  date = "date",
  datetime = "datetime",
  rating5 = "rating5",
  rating5precision = "rating5precision",
  rating10 = "rating10",
  rating10precision = "rating10precision",
  priority = "priority",
  switch = "switch",
  url = "url",
}

export enum dbToAppTypeEnum {
  varchar255 = "line",
  text = "text",
  date = "date",
  datetime = "datetime",
}

export enum RegisteredFormNamesEnum {
  signup = "signup",
  login = "login",
  passwordRecoveryRequest = "passwordRecoveryRequest",
  passwordRecovery = "passwordRecovery",
  libraryCreate = "libraryCreate",
  libraryItem = "libraryItem",
}
