import { Action } from '../action.interface';
import { Context } from '../context';
import { asCode, asCollapsedPath, TableAlignment } from '../utils/message';
import { readFile } from '../utils/promises';

interface Params {
  header?: string;
  file?: string;
}

interface AssertionResult {
  ancestorTitles: string[];
  failureMessages: string[];
  fullName: string;
  location?: {
    column: number;
    line: number;
  };
  status: 'failed' | 'pending' | 'passed';
  title: string;
}

interface TestResult {
  assertionResults: AssertionResult[];
  endTime: number;
  message: string;
  name: string;
  startTime: number;
  status: 'failed' | 'pending' | 'passed';
  summary: string;
}

interface TestResults {
  numFailedTestSuites: number;
  numFailedTests: number;
  numPassedTestSuites: number;
  numPassedTests: number;
  numPendingTestSuites: number;
  numPendingTests: number;
  numRuntimeErrorTestSuites: number;
  numTotalTestSuites: number;
  numTotalTests: number;
  snapshot: {
    added: number;
    didUpdate: boolean;
    failure: boolean;
    filesAdded: number;
    filesRemoved: number;
    filesUnmatched: number;
    filesUpdated: number;
    matched: number;
    total: number;
    unchecked: number;
    uncheckedKeys: string[];
    unmatched: number;
    updated: number;
  };
  startTime: number;
  success: boolean;
  testResults: TestResult[];
  wasInterrupted: boolean;
}

export const action: Action<Params> = {
  name: 'jest',
  description: 'Prepares a report from Jest\'s JSON output.',
  args: [
    { name: 'header', type: 'string', description: 'a custom header', default: 'Jest' },
    { name: 'file', type: 'string', description: 'path to a test report file in repository' },
  ],
  execute: async (ctx: Context, params: Params) => {
    ctx.message.section(params.header);
    if (!params.file) {
      throw new Error('No "file" param specified. Please enter path to a JSON lint report file.');
    }
    let file: TestResults;
    try {
      file = JSON.parse(await readFile(params.file, 'utf-8'));
    } catch (ignored) {
      throw new Error(`Could not read report file at "${params.file}". It may not exist or it's not in JSON format.`);
    }
    if (file.success) {
      ctx.message.add(':tada: All tests passed' +
        (file.numPendingTests + file.numPendingTestSuites > 0 ? ', however some are still pending.' : '!'));
    } else {
      ctx.message.error('Some tests failed!');
    }
    const statsTable = [
      ['Stats', 'Test Suites', 'Tests'],
      [':green_heart: Passed', file.numPassedTestSuites, file.numPassedTests],
      [':anger: Failed', file.numFailedTestSuites, file.numFailedTests],
      [':grey_exclamation: Pending', file.numPendingTestSuites, file.numPendingTests],
      file.numRuntimeErrorTestSuites && [':shit: Runtime errors', file.numRuntimeErrorTestSuites, ''],
      [':raised_hands: **Total**', `**${file.numTotalTestSuites}**`, `**${file.numTotalTests}**`],
    ];
    ctx.message.table(statsTable, [TableAlignment.Left, TableAlignment.Right, TableAlignment.Right]);

    if (!file.success) {
      const failedTests = [['Location', 'Line', 'Title', 'Message']];
      file.testResults
        .forEach((result) => {
          if (result.status !== 'failed') {
            return;
          }
          result.assertionResults.forEach((assertion) => {
            if (assertion.status !== 'failed') {
              return;
            }
            failedTests.push([
              asCollapsedPath(result.name.replace(ctx.config.ci.buildDir, '')),
              asCode(assertion.location ? `${assertion.location.line}:${assertion.location.column}` : '-'),
              [...assertion.ancestorTitles, assertion.title].join(' > '),
              assertion.failureMessages.map(asCode).join('<br>'),
            ]);
          });
          failedTests.push([]);
        });
      ctx.message.add('**Errors:**');
      ctx.message.table(failedTests, [undefined, TableAlignment.Center]);
    }
  },
};
