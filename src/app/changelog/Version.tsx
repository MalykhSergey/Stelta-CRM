export default function Version(props: { version: string, changes: string[] }) {
    const changes_items = props.changes.map((change, index) => <li key={index} dangerouslySetInnerHTML={{ __html: change }} />);
    return (
        <div>
            <h2>Версия <span style={{ color: "blue" }}>{props.version}</span></h2>
            <hr />
            <h2 style={{ marginTop: "20px" }}>Что нового:</h2>
            <ul style={{ fontSize: "19px", marginTop: "20px", marginLeft: "40px" }}>
                {changes_items}
            </ul>
        </div>
    )
}