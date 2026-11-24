/**
 * Excerpt from Channelsmith (packages/director/src/longform.ts).
 * Shown for illustration only. The full source code is available at https://store.mikodes.com/p/channelsmith/
 *
 * Every AI step returns JSON. The answer is parsed, checked against a schema and the step's own rules,
 * and if anything is wrong the exact problems are sent back for a fix, at most twice. "Hard" problems
 * must be fixed; "soft" ones only trigger a repair while attempts remain.
 */

export const MAX_REPAIRS = 2;

// …

 * One validated answer: ask, parse, check with the schema and the step's own rules, and send the problems back for a
 * fix (at most MAX_REPAIRS repairs). Every long-form step and the language versions (localize.ts) go through it.
 */
export async function ask<T>(llm: LLM, usage: Usage[], spec: AskSpec<T>): Promise<Asked<T>> {
  const sources: WebSource[] = [];
  let r = await llm.complete({ system: spec.system, user: spec.user, step: spec.step, effort: spec.effort ?? 'high', maxTokens: spec.maxTokens, web: spec.web });
  for (let attempt = 1; ; attempt++) {
    usage.push({ step: attempt === 1 ? spec.step : 'repair', model: r.model, inputTokens: r.inputTokens, outputTokens: r.outputTokens });
    if (r.sources) sources.push(...r.sources);
    let hard: string[] = [], soft: string[] = [], value: T | undefined, raw: unknown;
    try { raw = parseReply(r.text); } catch (e) { hard = [`the reply was not valid JSON (${(e as Error).message.slice(0, 160)})`]; }
    if (!hard.length) {
      const p = spec.schema.safeParse(raw);
      if (!p.success) hard = zodIssues(p.error);
      else {
        value = p.data;
        const c = spec.check?.(p.data) ?? {};
        hard = c.hard ?? []; soft = c.soft ?? [];
        if (c.value !== undefined) value = c.value as T;
      }
    }
    if (!hard.length && (!soft.length || attempt > MAX_REPAIRS)) return { value: value as T, warnings: soft, sources, attempts: attempt };
    if (attempt > MAX_REPAIRS) throw new Error(`${spec.step}: Claude's answer is still invalid after ${MAX_REPAIRS} repairs:\n- ${hard.join('\n- ')}`);
    const prev = raw !== undefined ? '```json\n' + JSON.stringify(raw, null, 1) + '\n```' : r.text.slice(0, 20000);
    r = await llm.complete({
      system: spec.system, step: 'repair', effort: 'medium', maxTokens: spec.maxTokens,
      user: [...spec.user, { type: 'text', text: `# Your previous answer\n${prev}\n\n# Problems to fix\n${[...hard, ...soft].map(x => `- ${x}`).join('\n')}\n\nFix only what the problems point at and keep everything else identical. The honesty rules still apply: never fix a problem by inventing a fact or a source. Return the complete corrected JSON object in one \`\`\`json fence.` }],
    });
  }
}
