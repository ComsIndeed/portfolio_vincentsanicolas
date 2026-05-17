/**
 * Smart Grid Snapper
 * Automatically pads elements to the nearest grid increment (2rem / 32px)
 * and locks the content container horizontally on the visual grid.
 */
export const snapToGrid = () => {
	const blocks = document.querySelectorAll('[data-snap="block"]');
	const main = document.querySelector('main');
	const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
	const rootStyle = getComputedStyle(document.documentElement);
	
	// Read grid size dynamically from CSS custom properties
	const gridSizeVar = rootStyle.getPropertyValue('--grid-size').trim();
	let gridSize = 2 * rootFontSize; // 2rem fallback
	if (gridSizeVar.endsWith('rem')) {
		gridSize = parseFloat(gridSizeVar) * rootFontSize;
	} else if (gridSizeVar.endsWith('px')) {
		gridSize = parseFloat(gridSizeVar);
	}

	if (main) {
		// Read container width dynamically from CSS custom properties
		const viewportWidth = document.documentElement.clientWidth;
		const containerWidthVar = rootStyle.getPropertyValue('--container-width').trim();
		let containerWidth = (viewportWidth >= 1024 ? 64 : 48) * rootFontSize; // dynamic fallback
		if (containerWidthVar.endsWith('rem')) {
			containerWidth = parseFloat(containerWidthVar) * rootFontSize;
		} else if (containerWidthVar.endsWith('px')) {
			containerWidth = parseFloat(containerWidthVar);
		}

		if (viewportWidth > containerWidth) {
			const sideMargin = (viewportWidth - containerWidth) / 2;
			const nudge = -1 * (sideMargin % gridSize);
			main.style.transform = `translateX(${nudge}px)`;
		} else {
			main.style.transform = 'none';
		}
	}

	blocks.forEach((block) => {
		if (!(block instanceof HTMLElement)) return;
		
		block.style.minHeight = '0px';
		const naturalHeight = block.offsetHeight;
		const cellsNeeded = Math.ceil(naturalHeight / gridSize);
		const snappedHeight = Math.max(gridSize, cellsNeeded * gridSize);
		
		block.style.minHeight = `${snappedHeight}px`;
		block.style.display = 'flex';
		block.style.flexDirection = 'column';
		block.style.justifyContent = 'center';
		
		const gap = (snappedHeight - naturalHeight) / 2;
		block.style.setProperty('--snap-gap', `${gap}px`);
	});
};

// Handle ClientRouter lifecycle
document.addEventListener('astro:page-load', () => {
	// Instantly hide the page state to prepare for snapping calculations
	document.documentElement.classList.remove('grid-snapped');
	
	snapToGrid();
	
	// Reveal now that positioning is perfect and finalized
	document.documentElement.classList.add('grid-snapped');
	
	// Re-initialize observer on new content
	const observer = new ResizeObserver(snapToGrid);
	document.querySelectorAll('[data-snap="block"]').forEach(el => observer.observe(el));
});

window.addEventListener('resize', snapToGrid);
