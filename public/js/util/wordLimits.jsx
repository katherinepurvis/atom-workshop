export const wordLimits = {
	default: 400,
	qanda: 250,
};
export const tooLongMsg = (
	<div>
		Heads up.{' '}
		<strong>You've exceeded the {WordLimit} word limit for this field.</strong>{' '}
		You can still publish it, but bear in mind that atoms should be concise.
	</div>
);
