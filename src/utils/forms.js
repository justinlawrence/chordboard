export const mapRefToInputRef = ({ ref, ...rest }: UseFormRegisterReturn) => {
	return { inputRef: ref, ...rest }
}
