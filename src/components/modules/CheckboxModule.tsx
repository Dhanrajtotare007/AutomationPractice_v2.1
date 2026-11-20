import { useMemo, useState } from 'react';
import { CheckSquare, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Field';
import { PracticeGrid, OutputPanel } from './PracticeGrid';

const SKILLS = [
  { value: 'playwright', label: 'Playwright', testId: 'checkbox-skill-playwright' },
  { value: 'selenium', label: 'Selenium', testId: 'checkbox-skill-selenium' },
  { value: 'cypress', label: 'Cypress', testId: 'checkbox-skill-cypress' },
  { value: 'appium', label: 'Appium (mobile)', testId: 'checkbox-skill-appium' },
  { value: 'rest-assured', label: 'REST Assured', testId: 'checkbox-skill-rest-assured' },
];

export function CheckboxModule() {
  const [accepted, setAccepted] = useState(false);
  const [skills, setSkills] = useState<string[]>(['playwright']);
  const [newsletter, setNewsletter] = useState(true);

  const allSelected = skills.length === SKILLS.length;
  const someSelected = skills.length > 0 && !allSelected;

  const toggleSkill = (value: string, checked: boolean) => {
    setSkills((current) => (checked ? [...new Set([...current, value])] : current.filter((item) => item !== value)));
  };

  const selectedLabels = useMemo(
    () => SKILLS.filter((skill) => skills.includes(skill.value)).map((skill) => skill.label),
    [skills],
  );

  return (
    <PracticeGrid
      aside={
        <>
          <Card testId="checkbox-state">
            <CardHeader icon={<ListChecks className="h-4 w-4" aria-hidden />} title="Selected values" description="Updated live as boxes change." />
            <dl className="space-y-2 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Terms accepted</dt>
                <dd className="font-semibold" data-testid="checkbox-accepted-value">
                  {accepted ? 'true' : 'false'}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Skills</dt>
                <dd className="text-right font-semibold" data-testid="checkbox-skills-value">
                  {selectedLabels.length ? selectedLabels.join(', ') : '—'}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Newsletter</dt>
                <dd className="font-semibold" data-testid="checkbox-newsletter-value">
                  {newsletter ? 'subscribed' : 'not subscribed'}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Count</dt>
                <dd className="font-semibold" data-testid="checkbox-count-value">
                  {skills.length}
                </dd>
              </div>
            </dl>
          </Card>
          <OutputPanel title="Assertion ideas" tone="info" testId="checkbox-hints">
            <ul className="list-disc space-y-1 pl-4 text-xs text-slate-600 dark:text-slate-300">
              <li>expect(box).toBeChecked() / toBeDisabled()</li>
              <li>expect(box).toHaveAttribute('disabled', '')</li>
              <li>assert element.is_selected() in Selenium</li>
            </ul>
          </OutputPanel>
        </>
      }
    >
      <Card testId="checkbox-single">
        <CardHeader
          icon={<CheckSquare className="h-4 w-4" aria-hidden />}
          title="Single checkbox"
          description="A single boolean control wired to state, with a live readout."
          actions={
            <Badge tone={accepted ? 'success' : 'neutral'} testId="checkbox-accept-status">
              {accepted ? 'Accepted' : 'Not accepted'}
            </Badge>
          }
        />
        <div className="space-y-2">
          <Checkbox
            id="checkbox-accept-terms"
            name="accept-terms"
            testId="checkbox-accept-terms"
            label="I accept the terms and conditions"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400" data-testid="checkbox-accept-message">
            {accepted ? '✓ Great, you can continue to payment.' : 'You must accept the terms before continuing.'}
          </p>
          <Button size="sm" disabled={!accepted} onClick={() => setAccepted(false)} data-testid="checkbox-continue">
            Continue (resets the checkbox)
          </Button>
        </div>
      </Card>

      <Card testId="checkbox-group">
        <CardHeader
          icon={<ListChecks className="h-4 w-4" aria-hidden />}
          title="Multiple checkboxes"
          description="Grouped controls with select-all, deselect-all and an indeterminate master box."
          actions={
            <>
              <Button size="sm" variant="outline" onClick={() => setSkills(SKILLS.map((skill) => skill.value))} data-testid="checkbox-select-all">
                Select All
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSkills([])} data-testid="checkbox-deselect-all">
                Deselect All
              </Button>
            </>
          }
        />
        <label className="check-row mb-1 cursor-pointer border-b border-slate-200 pb-2 font-semibold dark:border-slate-800">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand-700"
            checked={allSelected}
            ref={(node) => {
              if (node) node.indeterminate = someSelected;
            }}
            onChange={(event) => setSkills(event.target.checked ? SKILLS.map((skill) => skill.value) : [])}
            data-testid="checkbox-select-all-master"
            aria-label="Select all skills"
          />
          <span>Select all skills</span>
        </label>
        <div className="grid gap-0.5 sm:grid-cols-2" role="group" aria-label="Skills">
          {SKILLS.map((skill) => (
            <Checkbox
              key={skill.value}
              id={skill.testId}
              name="skill"
              value={skill.value}
              testId={skill.testId}
              label={skill.label}
              checked={skills.includes(skill.value)}
              onChange={(event) => toggleSkill(skill.value, event.target.checked)}
            />
          ))}
        </div>
      </Card>

      <Card testId="checkbox-misc">
        <CardHeader title="Default, disabled and newsletter checkboxes" description="Mix of enabled and disabled states for state assertions." />
        <div className="grid gap-0.5 sm:grid-cols-2">
          <Checkbox
            id="checkbox-newsletter"
            name="newsletter"
            testId="checkbox-newsletter"
            label="Subscribe to the weekly automation digest"
            checked={newsletter}
            onChange={(event) => setNewsletter(event.target.checked)}
          />
          <Checkbox
            id="checkbox-disabled"
            name="disabled-checkbox"
            testId="checkbox-disabled"
            label="Disabled checkbox (cannot be toggled)"
            checked
            disabled
            readOnly
          />
          <Checkbox id="checkbox-prechecked" name="prechecked" testId="checkbox-prechecked" label="Pre-checked by default" defaultChecked />
        </div>
        <p className="help">
          Each input carries a stable <code className="font-mono">id</code> and <code className="font-mono">data-testid</code>, so ID,
          CSS, XPath and test-id strategies all resolve.
        </p>
      </Card>
    </PracticeGrid>
  );
}
