import Spinner from "../spinner/spinner-component";

export const SectionLoader = () => {
    return (
        <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner size="xl" />
        </div>
    );
};