import Version from "./Version"

export default function page() {
    const versions = [{
        version: "0.7.6", changes: [
            "Теперь можно создавать тендеры с одинаковыми реестровыми номерами. <b>Номер лота по прежнему должен быть уникален!</b>",
            "Максимальная длина номера телефона увеличена до 50 символов.",
            "Теперь в панели навигации отображается имя активного пользователя.",
            "Улучшена структура БД.",
            "Улучшен механизм логирования.",
        ]
    }]
    const versions_list = versions.map((version, index) => <Version key={index} version={version.version} changes={version.changes} />)
    return (
        <>
            <div className="card" style={{ padding: "40px", width: "800px", marginLeft: "auto", marginRight: "auto" }}>
                {versions_list}
            </div>
        </>
    )
}