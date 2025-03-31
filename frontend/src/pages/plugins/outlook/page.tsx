// const OutlookPlugin = () => {

//     const downloadUrl = "http://127.0.0.1:8000/api/v1/plugins/outlook/";

//     // Гибкий grid, grid 2fr_1fr
//     return <section className="grid grid-cols-2 overflow-y-scroll size-full gap-10 max-sm:flex max-sm:flex-col">
//         <div className="mt-5 flex flex-col gap-16 text-justify">
//             {/* Заголовок */}

//             <article className="flex flex-col gap-5">
//                 <span className="text-3xl font-bold" id="general-information">Общие сведения</span>

//                 <p>
//                     Приложение VISION поддерживает интеграцию с почтовым клиентом Outlook посредством плагина. С его помощью можно легко добавлять ссылки на конференции VISION в приглашения на встречи
//                 </p>

//                 <span className="bg-orange-400 rounded-lg bg-opacity-40 py-3 px-2 flex justify-center items-center">
//                     <p className="text-orange-400 font-bold
//                     text-[4rem] w-[200px] flex flex-col justify-center items-center scale-105 noselect">!</p>
//                     <p className="text-[1rem] p-2">
//                         Поддерживается работа с почтовыми клиентами Microsoft Outlook 2016+ на базе Microsoft Exchange с версиями mailbox api 1.4+. В случае использования другого почтового сервера или клиента работоспособность плагина не гарантирована.
//                     </p>
//                 </span>
//             </article>

//             <article className="flex flex-col gap-5">
//                 <span className="text-3xl font-bold" id="installation-guide">Руководство по установке</span>

//                 <div>Если в вашей организации допустима самостоятельная установка расширений Outlook и плагин не был развернут централизовано, вы можете установить плагин без помощи администратора:
//                     <ol className="list-decimal list-inside mt-2">
//                         <li>Скачайте XML <a href={downloadUrl} className="text-blue-500">файл</a> плагина</li>
//                         <li>Зайдите в Web-версию Microsoft Outlook</li>
//                     </ol>
//                 </div>

//                 <p>
//                     После входа в Outlook, нажимаем на шестирёнку справа вверху, далее «Управление надстройками», как представлено на рисунке ниже.
//                     <img src="/images/outlook-plugin/1.png" className="w-full m-auto mt-4" alt=""/>
//                 </p>

//                 <p>
//                     На странице управления надстройками выбираем кнопку «+», после чего в выпадающем списке выбираем «Добавить из файла», где выбираем скачанный XML-файл плагина.
//                     <img src="/images/outlook-plugin/2.png" className="w-full m-auto mt-4" alt=""/>
//                 </p>

//                 <span className="p-4 bg-green-300 rounded text-green-700">Поздравляем! Плагин успешно установлен.</span>
//             </article>

//             <article className="flex flex-col gap-5">
//                 <span className="text-3xl font-bold" id="user-manual">Руководство по эксплуатации</span>
//                 <p>
//                     Открываем календарь и нажимаем на кнопку «Создать встречу».
//                     <img src="/images/outlook-plugin/3.png" className="w-full m-auto mt-4" alt=""/>
//                 </p>
//                 <p>
//                     В открывшемся окне, в панели инструментов находим кнопку приложения «Быстрая ссылка в Vision Space». При нажатии на данную кнопку, появляется форма с просьбой ввести учётные данные пользователя. Вводим свои данные (e-mail и пароль, используемой в организации) и нажимаем кнопку «Войти».
//                     <img src="/images/outlook-plugin/4.png" className="w-full m-auto mt-4" alt=""/>
//                 </p>

//                 <p>
//                     После успешной авторизации (правильно введённых данных учётной записи), плагин готов к работе. Чтобы добавить во встречу ссылку на новую комнату, нажимаем на кнопку «Сгенерировать ссылку»
//                     <img src="/images/outlook-plugin/5.png" className="h-[500px] m-auto mt-4" alt=""/>
//                 </p>

//                 <p>
//                     Плагин сразу добавляет во встречу ссылку на новую комнату со случайным ID. Выбор используемой комнаты не предусмотрен, добавляется сгенерированная быстрая ссылка, которая не отобразится в списке комнат вашего личного кабинета VISION.
//                     <img src="/images/outlook-plugin/6.png" className="w-full m-auto mt-4" alt=""/>
//                 </p>
//             </article>

//             <article className="flex flex-col gap-5">
//                 <span className="text-3xl font-bold" id="links">Полезные ссылки</span>
//                 <span className="text-[18px] w-auto bg-orange-400 rounded-lg py-3 px-2 flex justify-center items-center" id="download-plugin">
//                     <a href={downloadUrl}>Скачать плагин</a>
//                 </span>
//             </article>
//         </div>
//         <div className="mt-6 flex w-[400px] h-min flex-col gap-5 sticky top-0 overflow-hidden max-sm:hidden">
//             <span className="text-3xl font-bold">Содержание</span>

//             <ol className="list-decimal list-inside text-[1.2rem]">
//                 <li>
//                     <a href="#general-information">Общие сведения</a>
//                 </li>
//                 <li>
//                     <a href="#installation-guide">Руководство по установке</a>
//                 </li>
//                 <li>
//                     <a href="#user-manual">Руководство по эксплуатации</a>
//                 </li>
//                 <li>
//                     <a href="#links">Ссылки</a>
//                 </li>
//             </ol>
//         </div>
//     </section>
// }

// export default OutlookPlugin
