export enum AppRoutes {
  appHome = "/app",
  login = "/login",
  signup = "/signup",
  profile = "/profile",
}

export enum AccountStatusEnum {
  CREATED = "CREATED",
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
  DELETED = "DELETED",
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

export enum RegisteredFormNamesEnum {
  signup = "signup",
  login = "login",
  passwordRecoveryRequest = "passwordRecoveryRequest",
  passwordRecovery = "passwordRecovery",
  libraryCreate = "libraryCreate",
  libraryItem = "libraryItem",
  profile = "profile",
}
