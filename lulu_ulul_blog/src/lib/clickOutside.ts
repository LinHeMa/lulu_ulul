type ClickOutsideCallback = () => void;

export function clickOutside(node: HTMLElement, callback?: ClickOutsideCallback) {
	let storedCallback = callback;

	const handleClick = (event: MouseEvent) => {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			storedCallback?.();
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		update(newCallback?: ClickOutsideCallback) {
			storedCallback = newCallback;
		},
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
