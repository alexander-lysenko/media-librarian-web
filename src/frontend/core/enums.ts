/**
 * Enum representing the application routes for navigation.
 * Each route is defined as a string constant.
 * This enum is useful for maintaining consistent paths across the application.
 *
 * Enum Members:
 * - appHome: Represents the main page route of the application.
 * - login: Represents the login page route.
 * - signup: Represents the signup or registration page route.
 * - profile: Represents the user profile page route.
 * - passwordReset: Represents the route for resetting user passwords.
 * - emailConfirmation: Represents the route for confirming user email addresses.
 */
export enum AppRoutes {
  appHome = '/app',
  login = '/login',
  signup = '/signup',
  profile = '/profile',
  passwordReset = '/password-reset',
  emailConfirmation = '/email-confirmation',
}

/**
 * Enum representing possible statuses of an account.
 *
 * This enum can be used to define and manage the different states an account can exist in.
 * It provides a set of constant string values that describe each potential status.
 *
 * Members:
 * - CREATED: Indicates that the account has been created but not yet activated.
 * - ACTIVE: Denotes an account that is currently active and in good standing.
 * - BANNED: Represents an account that has been restricted due to violations or other reasons.
 * - DELETED: Specifies an account that has been permanently removed.
 */
export enum AccountStatusEnum {
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
}

// noinspection GrazieInspection
/**
 * Enumeration representing various types of library elements.
 *
 * This enum defines a set of constants that represent different
 * types of elements commonly encountered in a library system.
 * These types can be used to classify or identify specific
 * element types and their respective features.
 *
 * The available enumeration values include:
 * - line: Represents a line element.
 * - text: Represents a textual element.
 * - date: Represents a date element.
 * - datetime: Represents a date-time element.
 * - url: Represents a URL element.
 * - checkmark: Represents a checkmark element.
 * - rating5: Represents a 5-point rating element.
 * - rating5precision: Represents a 5-point rating element with step 0.5.
 * - rating10: Represents a 10-point rating element.
 * - rating10precision: Represents a 10-point rating element with step 0.5.
 * - priority: Represents a priority element.
 */
export enum LibraryElementEnum {
  line = 'line',
  text = 'text',
  date = 'date',
  datetime = 'datetime',
  url = 'url',
  checkmark = 'checkmark',
  rating5 = 'rating5',
  rating5precision = 'rating5precision',
  rating10 = 'rating10',
  rating10precision = 'rating10precision',
  priority = 'priority',
}

/**
 * Enumeration representing the names of various registered forms used within the application.
 * Each enum member corresponds to a specific form and its associated functionality.
 * Used with react-hook-form for form validation rules and form state management.
 *
 * Members:
 * - signup: Represents the registration/signup form.
 * - login: Represents the login form for user authentication.
 * - passwordRecoveryRequest: Represents the form for requesting password recovery.
 * - passwordRecovery: Represents the form for resetting the password.
 * - libraryCreate: Represents the form for creating a library.
 * - libraryItem: Represents the form for managing or interacting with a library item.
 * - profile: Represents the form for user profile management or editing.
 */
export enum RegisteredFormNamesEnum {
  signup = 'signup',
  login = 'login',
  passwordRecoveryRequest = 'passwordRecoveryRequest',
  passwordRecovery = 'passwordRecovery',
  libraryCreate = 'libraryCreate',
  libraryItem = 'libraryItem',
  profile = 'profile',
}
