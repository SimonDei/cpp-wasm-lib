#include <iostream>
#include <string>

#include "document.hpp"
#include "element.hpp"
#include "callable.hpp"

int main() {
    std::string selector = "p";
    element element = document::query_selector(selector);

    std::cout << element.text() << std::endl;

    element.text("Auf wiedersehen");

    callable<EmscriptenMouseEvent> click_callback{ [](int a, const EmscriptenMouseEvent* b, void* c) {
        std::cout << "Callback ausgefuehrt." << std::endl;
        return 1;
    } };

    void* ctx1;
    auto func_ptr1 = click_callback.get_function_ptr(&ctx1);

    element.add_event_listener("click", func_ptr1);

    return 0;
}
