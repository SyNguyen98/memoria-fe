import {render, screen} from "@testing-library/react";
import Faq from "./Faq.tsx";

test('renders Faq page successfully', () => {
    render(<Faq />);
    const textElement = screen.getByText(/Những câu hỏi thường gặp/i);
    expect(textElement).toBeInTheDocument();
});