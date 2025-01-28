'use client'
export default function GlobalError({error}: {
    error: Error & { digest?: string }
}) {
    return (
        <div className='card'>
            <h1>Возникла непредвиденная ошибка!</h1>
            <h2>Попробуйте вернутся назад</h2>
            <h4>Сообщение об ошибке:</h4>
            <p>{error.name}</p>
            <p>{error.message}</p>
            <p>{error.stack}</p>
        </div>
    )
}