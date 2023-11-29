declare module "*.unit" {
	type Result = {
		_setFn: (fn: string, data: string) => void;
		html: () => string;
	};
	const result: () => Result;
	export default result;
}
