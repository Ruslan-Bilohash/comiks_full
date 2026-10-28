; Комікс·Lab — інсталятор для Windows (Inno Setup 6)
;
; Два різновиди з одного файлу:
;   ISCC.exe komikslab.iss                  → легкий: ярлик на сайт у вікні застосунку
;   ISCC.exe /DFULL komikslab.iss           → повний: увесь вміст на диск, працює без мережі
;
; Чому ярлик веде не на .exe, а на браузер із ключем --app: Комікс·Lab — це
; вебзастосунок, і власна оболонка (Electron) додала б 150 МБ рушія заради того,
; що Edge і Chrome уже вміють. У режимі --app вікно без адресного рядка й вкладок,
; тобто на вигляд це звичайна програма.
;
; Перевірено: вміст запускається просто з файлів (file://) — 81 комікс і все
; озвучення, без жодного сервера.

#define AppName "Komiks·Lab"
#define AppVer "1.1"
#define AppPub "Komiks·Lab"
#define AppUrl "https://bilohash.com/comiks/"
#define SrcRoot "..\"

#ifdef FULL
  #define SetupName "KomiksLab-Offline-Setup"
  #define AppMode "offline"
#else
  #define SetupName "KomiksLab-Setup"
  #define AppMode "online"
#endif

[Setup]
AppId={{9B1E2C54-7A3D-4F18-9C62-KOMIKSLAB0001}
AppName={#AppName}
AppVersion={#AppVer}
AppPublisher={#AppPub}
AppPublisherURL={#AppUrl}
AppSupportURL={#AppUrl}
DefaultDirName={autopf}\KomiksLab
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
; без прав адміністратора: ставимо в теку користувача, тож інсталятор не питає UAC
PrivilegesRequired=lowest
OutputDir=.\out
OutputBaseFilename={#SetupName}
SetupIconFile={#SrcRoot}icons\favicon.ico
UninstallDisplayIcon={app}\komikslab.ico
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
; Повні метадані: файл без версії й видавця фільтри Windows люблять менше.
VersionInfoVersion={#AppVer}.0.0
VersionInfoCompany={#AppPub}
VersionInfoDescription={#AppName} — вивчення норвезької через комікси
VersionInfoProductName={#AppName}
VersionInfoProductVersion={#AppVer}
VersionInfoCopyright=© 2026 {#AppPub}
VersionInfoOriginalFileName={#SetupName}.exe
AppCopyright=© 2026 {#AppPub}
; Підпис умикається ключем: ISCC.exe /DSIGN komikslab.iss
; Потрібен справжній сертифікат Code Signing — самопідписаний SmartScreen не прибирає.
#ifdef SIGN
SignTool=komiks
SignedUninstaller=yes
#endif
ArchitecturesInstallIn64BitMode=x64compatible
; mp3 вже стиснуті — не марнуємо хвилини на повторне стискання
#ifdef FULL
InternalCompressLevel=fast
#endif

[Languages]
Name: "uk"; MessagesFile: "compiler:Languages\Ukrainian.isl"
Name: "en"; MessagesFile: "compiler:Default.isl"
Name: "no"; MessagesFile: "compiler:Languages\Norwegian.isl"

[CustomMessages]
uk.DesktopIcon=Ярлик на робочому столі
uk.LaunchApp=Відкрити Комікс·Lab
uk.NoBrowser=Потрібен Microsoft Edge або Google Chrome. Встановіть один із них і запустіть ярлик знову.
en.DesktopIcon=Shortcut on the desktop
en.LaunchApp=Open Komiks·Lab
en.NoBrowser=Microsoft Edge or Google Chrome is required. Install one of them and run the shortcut again.
no.DesktopIcon=Snarvei på skrivebordet
no.LaunchApp=Åpne Komiks·Lab
no.NoBrowser=Microsoft Edge eller Google Chrome kreves. Installer én av dem og kjør snarveien igjen.

[Tasks]
; робочий стіл позначений одразу: саме цього від інсталятора й чекають
Name: "desktopicon"; Description: "{cm:DesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "{#SrcRoot}icons\favicon.ico"; DestDir: "{app}"; DestName: "komikslab.ico"; Flags: ignoreversion
#ifdef FULL
; увесь застосунок: комікси, озвучення, тести — працює без інтернету
Source: "{#SrcRoot}app\android_offline\www\*"; DestDir: "{app}\app"; Flags: ignoreversion recursesubdirs createallsubdirs
#endif

[Icons]
#ifdef FULL
Name: "{group}\{#AppName}"; Filename: "{code:BrowserPath}"; Parameters: "{code:BrowserArgs}"; IconFilename: "{app}\komikslab.ico"; Comment: "{#AppName}"
Name: "{autodesktop}\{#AppName}"; Filename: "{code:BrowserPath}"; Parameters: "{code:BrowserArgs}"; IconFilename: "{app}\komikslab.ico"; Comment: "{#AppName}"; Tasks: desktopicon
#else
Name: "{group}\{#AppName}"; Filename: "{code:BrowserPath}"; Parameters: "{code:BrowserArgs}"; IconFilename: "{app}\komikslab.ico"; Comment: "{#AppName}"
Name: "{autodesktop}\{#AppName}"; Filename: "{code:BrowserPath}"; Parameters: "{code:BrowserArgs}"; IconFilename: "{app}\komikslab.ico"; Comment: "{#AppName}"; Tasks: desktopicon
#endif
Name: "{group}\{cm:UninstallProgram,{#AppName}}"; Filename: "{uninstallexe}"

[Run]
Filename: "{code:BrowserPath}"; Parameters: "{code:BrowserArgs}"; Description: "{cm:LaunchApp}"; Flags: nowait postinstall skipifsilent

[Code]
var
  CachedBrowser: String;

{ Шукаємо Edge, далі Chrome. Порожній результат означає «браузера немає» —
  тоді ярлик веде просто на файл, і сторінку відкриє той браузер, що стоїть типово. }
function FindBrowser(): String;
var
  P: String;
begin
  if CachedBrowser <> '' then begin
    Result := CachedBrowser;
    exit;
  end;
  P := ExpandConstant('{pf32}\Microsoft\Edge\Application\msedge.exe');
  if not FileExists(P) then P := ExpandConstant('{pf}\Microsoft\Edge\Application\msedge.exe');
  if not FileExists(P) then P := ExpandConstant('{pf32}\Google\Chrome\Application\chrome.exe');
  if not FileExists(P) then P := ExpandConstant('{pf}\Google\Chrome\Application\chrome.exe');
  if not FileExists(P) then P := ExpandConstant('{localappdata}\Google\Chrome\Application\chrome.exe');
  if not FileExists(P) then P := '';
  CachedBrowser := P;
  Result := P;
end;

function BrowserPath(Param: String): String;
var
  B: String;
begin
  B := FindBrowser();
  if B <> '' then
    Result := B
  else
#ifdef FULL
    Result := ExpandConstant('{app}\app\index.html');
#else
    Result := ExpandConstant('{app}\komikslab.url');
#endif
end;

{ Адреса застосунку: у повній збірці — файл на диску, у легкій — сайт. }
function AppTarget(): String;
begin
#ifdef FULL
  Result := 'file:///' + ExpandConstant('{app}\app\index.html');
  StringChangeEx(Result, '\', '/', True);
#else
  Result := '{#AppUrl}?app=windows';   // щоб лічильник встановлень бачив Windows-застосунок
#endif
end;

function BrowserArgs(Param: String): String;
begin
  if FindBrowser() = '' then
    Result := ''
  else
    { --app даємо вікно без адресного рядка й вкладок: на вигляд звичайна програма }
    Result := '--app="' + AppTarget() + '"';
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  F: TStringList;
begin
  if CurStep = ssPostInstall then begin
    { Запасний ярлик на випадок, коли браузера з --app не знайшлося }
    F := TStringList.Create;
    try
      F.Add('[InternetShortcut]');
      F.Add('URL=' + AppTarget());
      F.Add('IconFile=' + ExpandConstant('{app}\komikslab.ico'));
      F.Add('IconIndex=0');
      F.SaveToFile(ExpandConstant('{app}\komikslab.url'));
    finally
      F.Free;
    end;
    if FindBrowser() = '' then
      MsgBox(ExpandConstant('{cm:NoBrowser}'), mbInformation, MB_OK);
  end;
end;

[UninstallDelete]
Type: files; Name: "{app}\komikslab.url"
#ifdef FULL
Type: filesandordirs; Name: "{app}\app"
#endif
