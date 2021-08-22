const MuteComponent = (sound: boolean, action: Function) => {
    return (
        <button className={`btn btn${sound ? '' : '-outline'}-warning`}
                onClick={() => action(!sound)}>Sound: {sound ? 'ON' : 'OFF'}</button>
    )
}
export default MuteComponent;
