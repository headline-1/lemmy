export type Args = {
  local?: string;
  init?: boolean;
  force?: boolean;
  'actions-doc'?: string;
};

export interface Config {
  args: Args;
  git: {
    baseBranch?: string;
    isBaseBranchSynchronized?: boolean;
    repo?: string;
    pull?: string;
    commit?: string;
  };
  ci: {
    name: string;
    os?: string;
    buildNumber?: string;
    jobNumber?: string;
    buildDir?: string;
  };
  message: {
    github?: string;
  };
  actions: any[];
}
