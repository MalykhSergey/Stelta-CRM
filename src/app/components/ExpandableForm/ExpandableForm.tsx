import React, {useState} from 'react';
import styles from "./ExpandableForm.module.css"

interface ExpandableContainerProps {
    header: (toggle: () => void, isExpanded: boolean) => React.ReactNode;
    children: React.ReactNode;
    start_value?: boolean;
    additional_class?: string
}

const ExpandableContainer: React.FC<ExpandableContainerProps> = ({header, children, start_value = false, additional_class = '', ...rest}) => {
    const [isExpanded, setIsExpanded] = useState(start_value);

    const toggle = () => setIsExpanded(!isExpanded);

    return (
        <div className={`card ${styles.expandableForm}  ${isExpanded ? styles.expanded : ''} ${additional_class}`} {...rest}>
            {header(toggle, isExpanded)}
            <div className={`${styles.hiddenContent}`}>
                {children}
            </div>
        </div>
    );
};

export default ExpandableContainer;
