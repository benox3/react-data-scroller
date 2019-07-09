# react-data-scroller

[react-data-scroller](https://github.com/benox3/react-data-scroller) is a React component for scrolling large amounts of data efficiently

**This is currently a WIP and is not yet ready for production use. The API is
not stable and is still evolving. Use at your own risk!**

![Screen Capture](/docs/assets/data-scroller-capture.gif)

## Why?
[react-data-scroller](https://github.com/benox3/react-data-scroller) was originally designed as a drop in replacement for
[react-virtualized](https://github.com/bvaughn/react-virtualized) but focused
on preventing the constant mounting, unmounting and repainting of entire rows
that occurs. The focus is rendering your data in the most efficient way
which involves only rerendering (no unmounts/mounts and only minimal repainting)
of the rows and shifting the data around.

**Feature Checklist**
- [x] Column Groups
- [ ] Scroll handling from parent
- [ ] Horizontal Virtualization
- [ ] Freezing any columns (Not just left)
- [ ] Nested Groups
