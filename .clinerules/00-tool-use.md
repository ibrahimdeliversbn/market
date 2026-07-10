When using the attempt_completion tool, you MUST always include the "result" parameter with a clear text summary of what was completed. Never call attempt_completion with a missing or empty result.

Example of correct usage:
<attempt_completion>
<result>I have reviewed the project structure and confirmed I can see all files including pages/, package.json, and lib/supabaseClient.js.</result>
</attempt_completion>
