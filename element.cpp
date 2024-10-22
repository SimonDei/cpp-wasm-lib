#include "element.hpp"

using namespace emscripten;

std::string element::text() const {
    return _ref["textContent"].as<std::string>();
}

void element::text(const std::string& text) {
    _ref.set("textContent", text);
}

void element::add_event_listener(const std::string &event_name, int (*callback)(int, const EmscriptenMouseEvent*, void*)) {
    _ref.call<val>("setAttribute", val{"id"}, val{"c13579"});
    emscripten_set_click_callback("#c13579", nullptr, EM_TRUE, callback);
}
