const ButtonComponent = (name: string, action: Function) => {
    return (
        <button class='btn btn-warning' onClick={action}>{name}</button>
    );
}
export default ButtonComponent;
