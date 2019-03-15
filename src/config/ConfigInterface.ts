export default interface ConfigInterface {
  [key: string]: boolean | number | string | string[] | undefined;

  clientID: string;
  token: string;
  language?: string;
  prefix?: string;
  acceptedExtensions?: string[];
  ignoredRoles?: string[];
  maximumFileSize?: number;
  volume?: number;
  deleteMessages?: boolean;
  stayInChannel?: boolean;
  deafen?: boolean;
  game?: string;
}
