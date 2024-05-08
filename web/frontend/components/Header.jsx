import { Text, Button } from "@shopify/polaris";
import { useNavigate } from 'react-router-dom';
const Header = ({ buttonText, callBackFunction }) => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0px 10%' }}>
            <div style={{ cursor: 'pointer', }} onClick={() => {
                navigate("/");

            }}>
                <Text variant="heading4xl" as="h2">QuizWise</Text>
            </div>
            {buttonText && (
                <Button primary onClick={() => callBackFunction()}>{buttonText}</Button>
            )}
        </div>
    )
}

export default Header;
