type InfoFormData = {
    title: string
    description: string
}

type InfoFormProps = InfoFormData & {
    updateFields: (fields: Partial<InfoFormData>) => void
}

export function InfoForm({title, description, updateFields}: InfoFormProps) {
    return (
        <>
            <input
                type="text"
                placeholder="Название конференции (макс. 100 символов)"
                className="w-full rounded-[6px] text-left px-3 
                bg-inherit h-10 outline-none border-[0.01px] 
                border-white border-opacity-10 text-white 
                placeholder:text-opacity-60 text-[0.865rem]"
                defaultValue={title}
                required
                maxLength={100}
                onChange={(e) => {
                    updateFields(
                        { title: e.target.value }
                    )
                }}
            />
            <textarea
                className="bg-transparent h-[120px] outline-none border border-white border-opacity-10 p-3 text-[0.865rem] rounded-[8px] text-white"
                placeholder="Описание конференции (макс. 255 символов)"
                maxLength={255}
                style={{ resize: 'none' }}
                cols={10}
                defaultValue={description}
                onChange={(e) => {
                    updateFields(
                        { description: e.target.value }
                    )
                }}
            ></textarea>
        </>
    )
}