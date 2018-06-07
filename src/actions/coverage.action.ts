import { Action } from '../action.interface';
import { Context } from '../context';
import { asCollapsedPath, bold, TableAlignment } from '../utils/message.util';
import { readFile } from '../utils/promises.util';

interface Params {
  header?: string;
  file?: string;
  warnThreshold?: number;
  errorThreshold?: number;
  skipCovered?: boolean;
}

type Coverage = Record<string, FileCoverage>;

type Position = { line: number; column: number };
type Location = { start: Position, end: Position };
type CoverageStat = { covered: number; total: number };
type CoverageStatLine = { branches: CoverageStat; statements: CoverageStat; functions: CoverageStat; };
type CoverageStatFileLine = { name: string } & CoverageStatLine;

interface FileCoverage {
  path: string;
  statementMap: Record<string, Location>;
  fnMap: Record<string, { name: string, decl: Location, loc: Location }>;
  branchMap: Record<string, { type: string, loc: Location, locations: Location[] }>;
  s: Record<string, number>;
  f: Record<string, number>;
  b: Record<string, [number, number]>;
}

const emptyCoverageStat: CoverageStat = { covered: 0, total: 0 };
const extractFileCoverage = (buildDir: string) => (file: Coverage): CoverageStatFileLine[] =>
  Object.values(file).map(file => ({
    name: file.path.replace(buildDir, ''),
    branches: Object.values(file.b).reduce(
      (r, b) => ({ covered: r.covered + b.reduce((sum, v) => sum + (v ? 1 : 0), 0), total: r.total + b.length }),
      emptyCoverageStat
    ),
    statements: Object.values(file.s).reduce(
      (r, s) => ({ covered: r.covered + (s ? 1 : 0), total: r.total + 1 }),
      emptyCoverageStat
    ),
    functions: Object.values(file.f).reduce(
      (r, f) => ({ covered: r.covered + (f ? 1 : 0), total: r.total + 1 }),
      emptyCoverageStat
    ),
  }));
const generateCoverageSummary = (files: CoverageStatFileLine[]) =>
  Object.values(files).reduce(
    (r, f) => ({
      statements: {
        covered: r.statements.covered + f.statements.covered,
        total: r.statements.total + f.statements.total,
      },
      branches: {
        covered: r.branches.covered + f.branches.covered,
        total: r.branches.total + f.branches.total,
      },
      functions: {
        covered: r.functions.covered + f.functions.covered,
        total: r.functions.total + f.functions.total,
      },
    }),
    { statements: emptyCoverageStat, branches: emptyCoverageStat, functions: emptyCoverageStat }
  );

const isCoverageStat = (object: any): object is CoverageStat =>
  object.hasOwnProperty('total') && object.hasOwnProperty('covered');

const getPercentage = (stat: CoverageStat | CoverageStatLine) => {
  if (isCoverageStat(stat)) {
    return stat.total === 0 ? 100 : (stat.covered * 100 / stat.total);
  }
  return Object.values(stat)
    .map(stat => stat.hasOwnProperty('total') ? getPercentage(stat) : null)
    .filter(v => v !== null)
    .reduce((min, stat) => stat < min ? stat : min, 100);
};

const formatPercentage = (stat: CoverageStat) => getPercentage(stat).toFixed(2);

const formatFraction = (stat: CoverageStat) => `${stat.covered}/${stat.total}`;

const isBelowThreshold = (threshold: number, stat: CoverageStat | CoverageStatLine) => getPercentage(stat) < threshold;

const getThresholdSignFunction = (warnThreshold: number, errorThreshold: number) =>
  (stat: CoverageStat | CoverageStatLine) =>
    isBelowThreshold(errorThreshold, stat)
      ? ':no_entry:'
      : isBelowThreshold(warnThreshold, stat)
      ? ':warning:'
      : ':white_check_mark:';

const isFullyCovered = (line: CoverageStatLine) => !isBelowThreshold(99.99, line);

const formatStatLine = (getThresholdSign: (stat: CoverageStat) => string) =>
  (name: string, property: keyof CoverageStatLine, line: CoverageStatLine): string[] => ([
    name,
    formatPercentage(line[property]),
    formatFraction(line[property]),
    getThresholdSign(line[property]),
  ]);

export const coverage: Action<Params> = {
  name: 'coverage',
  description: 'Prepares a report from Coverage JSON output.',
  args: [
    { name: 'header', type: 'string', description: 'a custom header', default: 'Coverage' },
    { name: 'file', type: 'string', description: 'path to a coverage report file in repository' },
    {
      name: 'warnThreshold',
      type: 'number',
      description: 'accepted level of coverage (in %);' +
      ' if total coverage is below specified level, it will cause a warning',
      default: 80,
    },
    {
      name: 'errorThreshold',
      type: 'number',
      description: 'minimal level of coverage (in %);' +
      ' an error will be thrown if total coverage is below specified threshold',
      default: 40,
    },
    {
      name: 'skipCovered',
      type: 'boolean',
      description: 'set to false if file summary should not skip files that are covered in 100%',
      default: true,
    },
  ],
  execute: async (ctx: Context, params: Params) => {
    ctx.message.section(params.header);
    if (!params.file) {
      throw new Error('No "file" param specified. Please enter path to a JSON coverage report file.');
    }
    let file: Coverage;
    try {
      file = JSON.parse(await readFile(params.file, 'utf-8'));
    } catch (ignored) {
      throw new Error(`Could not read report file at "${params.file}". It may not exist or it's not in JSON format.`);
    }
    const files = extractFileCoverage(ctx.config.ci.buildDir)(file);
    const summary = generateCoverageSummary(files);

    const belowErrorThreshold =
      isBelowThreshold(params.errorThreshold, summary.statements)
      || isBelowThreshold(params.errorThreshold, summary.functions)
      || isBelowThreshold(params.errorThreshold, summary.branches);

    const getThresholdSign = getThresholdSignFunction(params.warnThreshold, params.errorThreshold);
    const formatSummary = formatStatLine(getThresholdSign);

    ctx.message
      .table([
        [bold('Summary'), bold('%'), '', ''],
        formatSummary('Statements', 'statements', summary),
        formatSummary('Branches', 'branches', summary),
        formatSummary('Functions', 'functions', summary),
      ], [
        TableAlignment.Left, TableAlignment.Right, TableAlignment.Right, TableAlignment.Center,
      ])
      .collapsibleSection('Coverage by file')
      .table([
        ['', 'File', 'Statements', '', 'Branches', '', 'Functions', ''],
        ...files
          .filter(file => !isFullyCovered(file))
          .map(file => [
            getThresholdSign(file),
            asCollapsedPath(file.name.replace(ctx.config.ci.buildDir, '')),
            formatPercentage(file.statements),
            formatFraction(file.statements),
            formatPercentage(file.branches),
            formatFraction(file.branches),
            formatPercentage(file.functions),
            formatFraction(file.functions),
          ]),
      ], [
        TableAlignment.Center,
        TableAlignment.Left,
        TableAlignment.Right,
        TableAlignment.Right,
        TableAlignment.Right,
        TableAlignment.Right,
        TableAlignment.Right,
        TableAlignment.Right,
      ])
      .collapsibleSectionEnd();
    if (belowErrorThreshold) {
      throw new Error(`Code coverage is below defined error threshold of ${params.errorThreshold}%.`);
    }
  },
};
