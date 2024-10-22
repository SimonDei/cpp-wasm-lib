#include "document.hpp"

using namespace emscripten;

element document::query_selector(const std::string &selector) {
    return element{
        val::global("document").call<val>("querySelector", selector)
    };
}
