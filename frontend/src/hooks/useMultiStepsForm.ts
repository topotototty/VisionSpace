import { ReactElement, useState } from "react";


export function useMultiStepsForm(
    steps: ReactElement[]
) {
    const [currentIndex, setCurrentIndex] = useState(0);

    function next() {
        setCurrentIndex(i => {
            if (i >= steps.length - 1) return i;
            return i + 1
        });
    }

    function previous() {
        setCurrentIndex(prev => prev - 1)
    }

    function goTo(index: number) {
        setCurrentIndex(index)
    }
    
    return {
        step: steps[currentIndex],
        steps,

        isFirst: currentIndex === 0,
        isLast: currentIndex === steps.length - 1,
        currentIndex,

        next,
        previous,
        goTo
    }
}